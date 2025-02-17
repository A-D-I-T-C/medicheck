'use server';

import { z } from 'zod';

import { createUser, getUser } from '@/lib/db/queries';

import { signIn } from './auth';

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  // role: z.enum(['doctor', 'patient']), // Add role to schema
});

export interface LoginActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'invalid_data';
  role?: string; // Add role to state
}

export const login = async (
  _: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> => {
  try {
    console.log("Login Attempt Started...");

    // ✅ Extract input data
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log("Extracted Credentials:", { email, password });

    // ✅ Validate input
    const parsedData = authFormSchema.safeParse({ email, password });
    if (!parsedData.success) {
      console.error("Validation Error:", parsedData.error.errors);
      return { status: "invalid_data" };
    }

    console.log("Validated Data:", parsedData.data);

    // ✅ Fetch user from the database
    const [user] = await getUser(parsedData.data.email);
    if (!user) {
      console.log("User not found in database!");
      return { status: "failed" };
    }

    console.log("User found:", user.email, "Role:", user.role);

    // ✅ Authenticate user
    const signInResponse = await signIn("credentials", {
      email: parsedData.data.email,
      password: parsedData.data.password,
      redirect: false,
    });

    console.log("SignIn Response:", signInResponse);

    // ✅ Return success response with role
    console.log("Login Successful! Redirecting user based on role...");
    return { status: "success", role: user.role };

  } catch (error) {
    console.error("Login Error:", error);

    if (error instanceof z.ZodError) {
      console.error("Zod Validation Error:", error.errors);
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};


export interface RegisterActionState {
  status:
    | 'idle'
    | 'in_progress'
    | 'success'
    | 'failed'
    | 'user_exists'
    | 'invalid_data';
}


const authFormSchemaReg = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['doctor', 'patient']), // Add role to schema
  name: z.string().min(1),

});


export const register = async (
  _: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> => {
  try {
    const validatedData = authFormSchemaReg.parse({
      email: formData.get('email'),
      password: formData.get('password'),
      role: formData.get('role'), // Add role to form data
      name: formData.get('name'),
    });

    const [user] = await getUser(validatedData.email);

    if (user) {
      return { status: 'user_exists' } as RegisterActionState;
    }
    await createUser(validatedData.email, validatedData.password, validatedData.role, validatedData.name);
    await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};
