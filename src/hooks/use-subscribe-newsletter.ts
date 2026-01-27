import { useMutation } from "@tanstack/react-query"; 
import { useAuth } from "@/auth/AuthProvider";

export function useSubscribeNewsletter() {
    const { subscribeNewsLetter } = useAuth();
    return useMutation({
        mutationKey: ["newsletter", "subscribe"],
        mutationFn: (email: string) => subscribeNewsLetter(email),
    })
}