import { errorResponse, successResponse } from '@/lib/apiResponses';
import User from '@/models/user';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { generateMealPlan } from '@/lib/openai';

async function PlansHandler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST': {
      const { user: auth0User } = await getSession(req, res);
      if (!auth0User.email_verified) {
        return errorResponse(res, 403, 'User not verified and cannot generate plans');
      }
      const user = await User.findOne({ email: auth0User.email });
      if (!user) {
        // NOTE: This should never happen
        return errorResponse(res, 404, 'User not found');
      }
      const plan = await generateMealPlan(user);
      return successResponse(res, 200, plan);
    }
    default: {
      res.setHeader('Allow', ['POST']);
      return errorResponse(res, 405, 'Method Not Allowed');
    }
  }
}

export default withApiAuthRequired(PlansHandler);