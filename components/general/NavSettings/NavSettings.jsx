import React from "react";
import SecondaryBtn from "../SecondaryBtn/SecondaryBtn";
import { IoLogOut } from "react-icons/io5";
import { signOut } from "next-auth/react";

export default function NavSettings() {
	return (
		<div>
			<SecondaryBtn
				icon={<IoLogOut />}
				content={"Sair"}
				as="btn"
				size="0.8rem"
				onClick={() => signOut()}
			/>

			<style jsx>{`
				div {
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					width: 100%;
					gap: 0.8rem;
				}
			`}</style>
		</div>
	);
}
