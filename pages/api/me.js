import User from '@/models/user';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { dbConnect } from '@/lib/dbConnect';
import { errorResponse, successResponse } from '@/lib/apiResponses';

async function createNewUser(auth0User) {
  return await User.create({
    email: auth0User.email,
  })
}

async function MeHandler(req, res) {
  const { method } = req

  try {
    await dbConnect();
  }
  catch (error) {
    console.log(error);
    return errorResponse(res, 500, 'Error connecting to database');
  }

  switch (method) {
    case 'GET': {
      try {
        const { user: auth0User } = await getSession(req, res)
        let user = await User.findOne({ email: auth0User.email });
        if (!user) {
          user = await createNewUser(auth0User);
        }
        return successResponse(res, 200, user);
      }
      catch (error) {
        console.log(error);
        return errorResponse(res, 500, 'Error finding current user');
      }
    }
    case 'PUT': {
      try {
        const { user: auth0User } = await getSession(req, res)
        let user = await User.findOneAndUpdate({ email: auth0User.email }, req.body);
        if (!user) {
          // NOTE: This should never happen
          return errorResponse(res, 404, 'User not found');
        }
        return successResponse(res, 200, user);
      }
      catch (error) {
        console.log(error);
        return errorResponse(res, 500, 'Error updating user');
      }
    }
    default: {
      res.setHeader('Allow', ['GET', 'PUT']);
      return errorResponse(res, 405, `Method ${method} not allowed`);
    }
  }
}

export default withApiAuthRequired(MeHandler);