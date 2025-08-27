import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SignInFlow } from "@/components/types"

const formSchema = z.object({
  username: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

interface SignInProps {
  setState: (state: SignInFlow) => void
}

export default function SignInComponent({setState} : SignInProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      const res = await fetch("https://ukashacoder.pythonanywhere.com/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const data = await res.json()
      if (res.ok) {
        console.log(data)
        console.log(data.access)
        localStorage.setItem('access', data.access)
        localStorage.setItem("employee_id", data.employee.id);
        router.push('/dashboard')
      } else {
        console.log(data.error || "Login failed")
      }
    } catch (error) {
      console.error(error)
      console.log("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#141D38] flex justify-center items-center py-12 p-4 max-[768px]:p-4">
        <div className="bg-white w-full max-w-sm rounded-xl shadow-lg overflow-hidden border-1 border-solid border-white">
        
        <div className="bg-[#141D38] flex flex-col items-center justify-center py-6 px-4 max-[768px]:p-2">
          <img src="/logo.png" alt="Company Logo" className="w-[40%] h-16 object-contain" />
          <h1 className="text-white text-2xl font-bold mt-3 max-[768px]:mb-3">Login</h1>
        </div>
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-8">
            <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                    <Input type="text" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <Button type="submit" className="w-full bg-[#141D38] hover:bg-[#0f162e] text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all disabled:opacity-50" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center text-[16px] font-medium">
                Or <Button onClick={() => setState("signUp")} className="font-bold text-[#111] bg-transparent hover:bg-transparent underline cursor-pointer">Sign Up</Button>
            </div>
            </form>
        </Form>
        </div>
    </div>
  )
}
