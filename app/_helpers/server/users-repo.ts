import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { headers } from 'next/headers';
import { MIN_PASSWORD_LENGTH, MIN_PASSWORD_MESSAGE } from '@/app/_helpers/shared/config';
import User from '@/models/User';

export const usersRepo = {
    authenticate,
    getAll,
    getById,
    getCurrent,
    create,
    // 
    update,
    // delete is a reserved word in javascript so we have to use _delete
    delete: _delete
};

async function authenticate({ email, password }: { email: string, password: string }) {
    const user = await User.findOne({ email });
    const isPasswordCorrect = bcrypt.compareSync(password, user?.password || '');
    if (!user || !isPasswordCorrect) {
        throw 'Email or password is incorrect';
    }

    // if (!user.emailVerified) {
    //     throw 'Please verify your email before logging in ('+user.email+')'
    // }
    // create a jwt token that is valid for 4 days
    const token = jwt.sign({ sub: user?.id }, process.env.JWT_SECRET!, { expiresIn: '4d' });

    return {
        user: user?.toJSON(),
        token
    };
}

async function getAll() {
    return await User.find();
}

// 
async function getById(id: string) {
    try {
        return await User.findById(id);
    } catch {
        throw 'User Not Found';
    }
}

// 
async function getCurrent() {
    try {
        const currentUserId = (await headers()).get('userId');
        return await User.findById(currentUserId);
    } catch {
        throw 'Current User Not Found';
    }
}

// function which has side effects of deleting the plaintext password from the params object and adding a hash property to the user object based on the password
function hashPassword(params: any, user: any){
    if (params.password) {
        if(params.password.length < MIN_PASSWORD_LENGTH) {
            throw MIN_PASSWORD_MESSAGE;
        }
        user.password = bcrypt.hashSync(params.password, 10);
        delete params.password
    }
}

async function create(params: any) {
    // validate
    if (await User.findOne({ email: params.email })) {
        throw 'Email "' + params.email + '" is already taken';
    }

    const user = new User(params);

    // hash password
    hashPassword(params, user);
    // save user
    await user.save();
    return user
}

// update a user by id with an object of user properties including email, password etc.
async function update(id: string, params: any) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.email !== params.email && await User.findOne({ email: params.email })) {
        throw 'Email "' + params.email + '" is already taken';
    }

    // hash password
    hashPassword(params, user);
    // assign properties including new password if that was updated
    // copy params properties to user
    Object.assign(user, params);

    await user.save();
}

async function _delete(id: string) {
    await User.findByIdAndDelete(id);
}

