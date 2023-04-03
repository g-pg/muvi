import React, { useCallback, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/router";

import PrimaryBtn from "@/components/general/PrimaryBtn/PrimaryBtn";
import { IoMdClose, IoLogoGithub } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import styles from "./AuthModal.module.css";
import Loading from "../Loading/Loading";

export default function AuthModal({ setShowModal }) {
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);
	const [warning, setWarning] = useState("warning");
	const [formType, setFormType] = useState("login");

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});

	function handleChangeFormType(type) {
		setWarning("warning");
		setFormType(type);
	}
	function handleChange(e) {
		setFormData((prev) => {
			return { ...prev, [e.target.id]: e.target.value };
		});
	}

	function handleSubmit(e) {
		e.preventDefault();
		if (formType === "register") {
			register();
		} else if (formType === "login") {
			login();
		}
	}

	const login = useCallback(async () => {
		try {
			setIsLoading(true);
			const res = await signIn("credentials", {
				email: formData.email,
				password: formData.password,
				redirect: false,
			});
			if (res.ok) {
				router.push("/user");
			} else {
				throw new Error(res.error);
			}
		} catch (error) {
			console.log(error);
			setWarning(error.message);
		}
		setIsLoading(false);
	}, [formData, router]);

	const register = useCallback(async () => {
		try {
			await axios.post("/api/register", formData, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			login();
		} catch (error) {
			console.log(error);
			setWarning(error.response.data.error);
		}
	}, [formData, login]);

	return (
		<>
			<div className={styles.modalWrapper}>
				<div className={styles.header}>
					<button
						style={{ color: formType === "login" && "var(--cl-accent)" }}
						onClick={() => handleChangeFormType("login")}
					>
						Login
					</button>
					<button
						style={{ color: formType === "register" && "var(--cl-accent)" }}
						onClick={() => handleChangeFormType("register")}
					>
						Cadastro
					</button>
				</div>
				<form onSubmit={handleSubmit}>
					{formType === "register" && (
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
						style={{ opacity: warning !== "warning" ? "1" : "0" }}
						className={styles.warning}
					>
						{warning}
					</p>
					<PrimaryBtn type="submit" style={{ width: "30%", marginTop: "0.5rem" }}>
						{formType === "login" ? "Login" : "Cadastro"}
					</PrimaryBtn>
				</form>
				<div
					className={styles.socialLoginWrapper}
					// style={
					// 	formType === "register" ? { opacity: "0", pointerEvents: "none" } : {}
					// }
				>
					<button onClick={() => signIn("google", { callbackUrl: "/user" })}>
						<FcGoogle />
					</button>
					<button onClick={() => signIn("github", { callbackUrl: "/user" })}>
						<IoLogoGithub />
					</button>
				</div>
				<p className={styles.disclaimer}>
					* Esta é uma aplicação de estudos. Todos os dados serão deletados em 7 dias
					a partir do registro.
				</p>
				<button onClick={() => setShowModal(false)} className={styles.closeBtn}>
					<IoMdClose style={{ fontSize: "1.8rem" }} />
				</button>
			</div>
			<div className={styles.overlay} onClick={() => setShowModal(false)}></div>
		</>
	);
}
