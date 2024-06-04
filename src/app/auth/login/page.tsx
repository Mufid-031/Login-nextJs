'use client'

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";


export default function LoginPage() {

    const { push } = useRouter();
    const callbackUrl = '/';

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const email = form.email.value;
        const password = form.password.value;
        try {
            const res = await signIn('credentials', {
                redirect: false,
                email: email,
                password: password,
                callbackUrl
            });
            
            if (!res?.error) {
                push(callbackUrl);
            } else {
                console.log(res.error);
            }
        } catch (error) {
            console.log(error);
        }


    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-900">
            <form className="flex flex-col gap-4 w-[400px]" onSubmit={(e) => handleSubmit(e)}>
                <label className="text-lg text-blue-300" htmlFor="email">Email</label>
                <input className="w-full h-10" type="email" name="email" id="email" />
                <label className="text-lg text-blue-300" htmlFor="password">Password</label>
                <input className="w-full h-10" type="password" name="password" id="password" />
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Login</button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => signIn('google')}>Login with Google</button>
            </form>
        </div>
    );
};