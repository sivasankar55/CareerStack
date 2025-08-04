import {axiosInstance} from "../../lib/axios";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import { useState } from "react";
import {toast} from "react-hot-toast";

const LoginForm = () => {

    const [email, setEmail] =useState("");
    const [password, setPassword] = useState("");
    const queryClient = useQueryClient(); // for invalidate query(authUser)

    const {mutate:loginMutation, isLoading} = useMutation({
        mutationFn: (userData) => axiosInstance.post("/auth/login", userData),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["authUser"]});
        },
        onError:(err) => {
            toast.error(err.response.data.message || "Something went wrong");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        loginMutation({email,password});
    };

    return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
            <input 
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full"
            required
            />
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full"
            required
            />

        <button type="submit" className="btn btn-primary w-full">
            {isLoading ? <Loader className="size-5 animate-spin"/> : "Login"}
        </button>
    </form>
    )
};

export default LoginForm;