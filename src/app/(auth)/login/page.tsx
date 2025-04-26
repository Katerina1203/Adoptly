"use client"
import React, { useState } from 'react';
import LoginForm from '@/components/login/login';
import RegisterForm from '@/components/login/register';
import Image from 'next/image';
import { handleGoogleLogin } from '@/lib/actions'

const FormSwitcher = () => {
	const [isLogin, setIsLogin] = useState(true);

	const toggleForm = () => {
		setIsLogin(!isLogin);
	};

	return (
		<div className="flex h-[75vh] w-full overflow-hidden">
			<div className={`flex-1 hidden md:flex justify-center items-center relative transition-transform duration-500 ease-in-out  ${isLogin ? "md:translate-x-0" : "md:translate-x-full"}`}>
				<Image
					src={isLogin ? "/img/family-with-dog.jpg" : "/img/girl-with-cat.jpg"}
					alt={isLogin ? "Family with dog" : "Girl with cat"}
					fill
					className="w-full h-full object-cover"
				/>
			</div>
			<div className={`flex-1 flex flex-col justify-center items-center p-8 transition-transform duration-500 ease-in-out ${isLogin ? "md:translate-x-0" : "md:-translate-x-full"}`}>
				{isLogin ? (
					<div>
						<LoginForm toggleForm={toggleForm} />

						<form action={handleGoogleLogin} className="text-blue-500 text-ml">
							<button>Вход с Google account</button>
						</form>
					</div>
				) : (
					<div>
						<RegisterForm toggleForm={toggleForm} />
						<form action={handleGoogleLogin} className="text-blue-500 text-ml">
							<button>Регистрация с Google account</button>
						</form>
					</div>

				)}
			</div>
		</div>
	);
};

export default FormSwitcher;
