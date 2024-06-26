import React, { useCallback, useContext, useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from './AuthModal.module.css';

import PrimaryBtn from '@/components/general/PrimaryBtn/PrimaryBtn';
import { IoMdClose, IoLogoGithub } from 'react-icons/io';
import { FcGoogle } from 'react-icons/fc';
import Loading from '../Loading/Loading';
import { AuthModalContext } from '@/context/AuthModalContext';

export default function AuthModal() {
	const { setShowAuthModal } = useContext(AuthModalContext);
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);
	const [warning, setWarning] = useState('warning');
	const [formType, setFormType] = useState('login');

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
	});

	useEffect(() => {
		if (router.query.error == 'OAuthAccountNotLinked') {
			setWarning('Parece que você se registrou com um método diferente. ');
		}
	}, [router.query.error]);
	function handleChangeFormType(type) {
		setWarning('warning');
		setFormType(type);
	}
	function handleChange(e) {
		setFormData((prev) => {
			return { ...prev, [e.target.id]: e.target.value };
		});
	}

	function handleSubmit(e) {
		e.preventDefault();

		if (formType === 'register') {
			if (formData.name.length > 50 || formData.email.length > 50) {
				return setWarning('O nome ou o email não podem ter mais de 50 caracteres.');
			}

			if (formData.name.length < 3) {
				return setWarning('O nome não pode ter menos de 3 caracteres.');
			}

			if (formData.password.length < 4) {
				return setWarning('A senha deve ter no mínimo 4 caracteres.');
			}
		}

		setIsLoading(true);
		if (formType === 'register') {
			register();
		} else if (formType === 'login') {
			login();
		}
	}

	const login = useCallback(async () => {
		try {
			setIsLoading(true);
			const res = await signIn('credentials', {
				email: formData.email.trim(),
				password: formData.password.trim(),
				redirect: false,
			});

			if (res.ok) {
				router.push('/user');
				setShowAuthModal(false);
			} else {
				throw new Error(res.error);
			}
		} catch (error) {
			setWarning(error.message);
		}
		setIsLoading(false);
	}, [formData, router, setShowAuthModal]);

	const register = useCallback(async () => {
		try {
			await axios.post('/api/register', formData);
			login();
		} catch (error) {
			setWarning('Oops, algo deu errado.');
		}
		setIsLoading(false);
	}, [formData, login]);

	async function handleOAuth(provider) {
		try {
			setIsLoading(true);
			await signIn(provider, { callbackUrl: '/user' });
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}
	return (
		<>
			<div className={styles.modalWrapper}>
				{isLoading && <Loading />}
				<div className={styles.header}>
					<button
						style={{ color: formType === 'login' && 'var(--cl-accent)' }}
						onClick={() => handleChangeFormType('login')}
					>
						Login
					</button>
					<button
						style={{ color: formType === 'register' && 'var(--cl-accent)' }}
						onClick={() => handleChangeFormType('register')}
					>
						Cadastro
					</button>
				</div>
				<form onSubmit={handleSubmit}>
					{formType === 'register' && (
						<input
							type="text"
							placeholder="Nome"
							id="name"
							onChange={handleChange}
							required
						/>
					)}
					<input
						type="email"
						placeholder="E-mail"
						id="email"
						onChange={handleChange}
						required
					/>
					<input
						type="password"
						placeholder="Senha"
						id="password"
						onChange={handleChange}
						required
					/>
					<p
						style={{ opacity: warning !== 'warning' ? '1' : '0' }}
						className={styles.warning}
					>
						{warning}
					</p>
					<PrimaryBtn type="submit" style={{ width: '30%', marginTop: '0.5rem' }}>
						{formType === 'login' ? 'Login' : 'Cadastro'}
					</PrimaryBtn>
				</form>
				<div
					className={styles.socialLoginWrapper}
					// style={
					// 	formType === "register" ? { opacity: "0", pointerEvents: "none" } : {}
					// }
				>
					<button onClick={() => handleOAuth('google')}>
						<FcGoogle />
					</button>
					<button onClick={() => handleOAuth('github')}>
						<IoLogoGithub />
					</button>
				</div>
				<p className={styles.disclaimer}>
					* Esta é uma aplicação de estudos. A senha é criptografada. Todos os dados
					podem ser deletados sem aviso prévio.
				</p>
				<button onClick={() => setShowAuthModal(false)} className={styles.closeBtn}>
					<IoMdClose style={{ fontSize: '1.8rem' }} />
				</button>
			</div>
			<div className={styles.overlay} onClick={() => setShowAuthModal(false)}></div>
		</>
	);
}
