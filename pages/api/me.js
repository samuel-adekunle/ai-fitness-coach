import User from '@/models/user';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { dbConnect } from '@/lib/dbConnect';
import { errorResponse, successResponse } from '@/lib/apiResponses';

async function createNewUser(auth0User) {
  return await User.create({
    email: auth0User.email,
  })
}

async function getCurrentUser(auth0User) {
  const user = await User.findOne({ email: auth0User.email });
  if (!user) {
    return await createNewUser(auth0User);
  }
  return user;
}

async function MeHandler(req, res) {
  const { method } = req
  const { id } = req.query

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
        const user = await getCurrentUser(auth0User);
        return successResponse(res, 200, user);
      }
      catch (error) {
        console.log(error);
        return errorResponse(res, 500, `Error finding user ${id}`);
      }
    }
    default: {
      res.setHeader('Allow', ['GET']);
      return errorResponse(res, 405, `Method ${method} not allowed`);
    }
  }
}

export default withApiAuthRequired(MeHandler);