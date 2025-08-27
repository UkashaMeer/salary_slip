import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { SignInFlow } from "@/components/types"

const formSchema = z.object({
  name: z.string().max(25, "Name must be at least 25 characters"),
  email: z.string().email("Enter a valid email"),
  salary: z.string().max(12, "Salary must be at least 12 characters"),
  phone: z.string().min(11, "Phone Number must be at least 12 characters"),
  cnic: z.string().min(13, "CNIC must be at least 13 characters"),
  address: z.string().max(45, "Address must be at least 45 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

interface SignUpProps {
  setState: (state: SignInFlow) => void
}

export default function SignUpComponent({setState}: SignUpProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      salary: "",
      phone: "",
      cnic: "",
      address: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      const res = await fetch("https://ukashacoder.pythonanywhere.com/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const data = await res.json()
      if (res.ok) {
        console.log(data)
      } else {
        console.log(data.error || "Register failed")
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
        <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg overflow-hidden border-1 border-solid border-white">
        
        <div className="bg-[#141D38] flex flex-col items-center justify-center py-6 px-4 max-[768px]:p-2">
          <img src="/logo.png" alt="Company Logo" className="w-[40%] h-16 object-contain" />
          <h1 className="text-white text-2xl font-bold mt-3 max-[768px]:mb-3">Sign Up</h1>
        </div>
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-8 flex flex-col items-center w-full">
            <div className="grid grid-cols-2 gap-5 w-full">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                    <Input type="text" placeholder="Enter Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Salary</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="Enter Your Salary" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                    <Input type="tel" placeholder="Enter Your Number" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="cnic"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>CNIC</FormLabel>
                    <FormControl>
                    <Input type="text" placeholder="Enter Your CNIC" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                    <Input type="text" placeholder="Enter Your Address" {...field} />
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

            </div>

            <div className="flex  items-center gap-4 w-full">
              <Button type="submit" className="w-1/2 bg-[#141D38] hover:bg-[#0f162e] text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all disabled:opacity-50" disabled={loading}>
                  {loading ? "Signing up..." : "Sign Up"}
              </Button>
              <div className=" text-[16px] font-medium">
                  Or <Button onClick={() => setState("signIn")} className="font-bold text-[#111] bg-transparent hover:bg-transparent underline cursor-pointer">Sign In</Button>
              </div>
            </div>
            </form>
        </Form>
        </div>
    </div>
  )
}
