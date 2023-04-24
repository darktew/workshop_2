import "@/styles/globals.css"
import "react-toastify/dist/ReactToastify.css"
import type { AppProps } from "next/app"
import Header from "@/components/header"
import { Router, useRouter } from "next/router"
import Cookies from "next-cookies"
import App from "next/app"

const MyApp = ({ Component, pageProps, user }: any) => {
  const router = useRouter()
  return (
    <div style={{ height: "100vh" }}>
      {!["/login", "/signup"].includes(router.pathname) && <Header user={user} />}
      <Component {...pageProps} />
    </div>
  )
}

MyApp.getInitialProps = async (context: any): Promise<any> => {
  const appProps = await App.getInitialProps(context)
  const { usertodo } = Cookies(context.ctx)
  return { ...appProps, user: usertodo }
}

export default MyApp
