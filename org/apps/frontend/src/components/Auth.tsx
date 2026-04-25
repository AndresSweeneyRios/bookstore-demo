import "./Auth.css"
import React from "react"
import { useAuth } from "../hooks/useAuth"
import { useModal } from "../hooks/useModal"
import { AreYouSure } from "./AreYouSure"
import { Button } from "./Button"
import LogInSvg from "../assets/log-in.svg?raw"
import LogOutSvg from "../assets/log-out.svg?raw"
import UserPlusSvg from "../assets/user-plus.svg?raw"
import { Input } from "./Input"
import AtSignSVG from "../assets/at-sign.svg?raw"
import LockSVG from "../assets/lock.svg?raw"
import UserSVG from "../assets/user.svg?raw"
import UploadSVG from "../assets/upload.svg?raw"
import { RegisterUserPayloadSchema, LoginUserPayloadSchema, CONSTANTS as SCHEMA_CONSTANTS } from "@libs/schema"
import { formatZodError } from "@libs/schema"
import { useLoading } from "../hooks/useLoading"
import { useUser } from "../hooks/useUser"
import { stringifyError } from "../utils/errors"

const Success = () => {
  return (
    <div id="auth-success">
      <h1>Success!</h1>
    </div>
  )
}

// TODO: refactor these into separate components
// TODO: create shared form component
export const Auth: React.FC = () => {
  const auth = useAuth()
  const modal = useModal()
  const user = useUser()
  const [registerModalVisible, setRegisterModalVisible] = React.useState(false)
  const [loginModalVisible, setLoginModalVisible] = React.useState(false)
  const [logoutModalVisible, setLogoutModalVisible] = React.useState(false)
  const { setLoading } = useLoading()

  const Register: React.FC = () => {
    const [email, setEmail] = React.useState("")
    const [displayName, setDisplayName] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [error, setError] = React.useState("")
    const [valid, setValid] = React.useState(false)

    React.useEffect(() => {
      setValid(false)

      if (!email || !displayName || !password || !confirmPassword) {
        setError("")

        return
      }

      const passwordMatches = password === confirmPassword

      if (!passwordMatches) {
        setError("Password must match!")

        return
      }

      const schema = RegisterUserPayloadSchema.safeParse({
        email,
        displayName,
        password,
      })

      if (!schema.success) {
        setError(formatZodError(schema.error))

        return
      }

      setError("")
      setValid(true)
    }, [email, displayName, password, confirmPassword])

    const submit = React.useCallback(async () => {
      if (!valid) {
        return
      }

      setLoading(true)

      try {
        await auth.register({
          email,
          displayName,
          password,
        })

        modal.setContent(<Success />)
      } catch (error) {
        setError(stringifyError(error))
      }

      setLoading(false)
    }, [email, displayName, password, confirmPassword, valid])

    return (
      <div id="register">
        <h2>Register</h2>
        <Input 
          type="email" 
          name="email"
          autoComplete="email"
          placeholder="Email..." 
          svgXml={AtSignSVG} 
          text={email} 
          setText={setEmail} 
        />
        <Input
          placeholder="Display name..." 
          type="text"
          name="name"
          autoComplete="name"
          svgXml={UserSVG} 
          text={displayName} 
          setText={setDisplayName} 
        />
        <Input 
          placeholder="Password..." 
          type="password"
          name="password"
          autoComplete="new-password"
          pattern={SCHEMA_CONSTANTS.PASSWORD_REGEX.source}
          svgXml={LockSVG} 
          text={password} 
          setText={setPassword} 
        />
        <Input 
          type="password"
          name="confirm-password"
          autoComplete="new-password"
          pattern={SCHEMA_CONSTANTS.PASSWORD_REGEX.source}
          placeholder="Confirm password..." 
          svgXml={LockSVG} 
          text={confirmPassword} 
          setText={setConfirmPassword} 
        />
        
        <Button svgXml={UploadSVG} disabled={!valid} onClick={() => submit()}>Submit</Button>
        {error && <small>{error}</small>}
      </div>
    )
  }

  const LogIn: React.FC = () => {
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [error, setError] = React.useState("")
    const [valid, setValid] = React.useState(false)

    React.useEffect(() => {
      setValid(false)

      if (!email|| !password) {
        setError("")

        return
      }

      const schema = LoginUserPayloadSchema.safeParse({
        email,
        password,
      })

      if (!schema.success) {
        setError(formatZodError(schema.error))

        return
      }

      setError("")
      setValid(true)
    }, [email, password])

    const submit = React.useCallback(async () => {
      if (!valid) {
        return
      }

      setLoading(true)

      try {
        await auth.login({
          email,
          password,
        })

        modal.setContent(null)
      } catch (error) {
        setError(stringifyError(error))
      }

      setLoading(false)
    }, [email, password, valid])

    return (
      <div id="login">
        <h2>Log in</h2>
        <Input 
          type="email" 
          name="email"
          autoComplete="email"
          placeholder="Email..." 
          svgXml={AtSignSVG} 
          text={email} 
          setText={setEmail} 
        />
        <Input 
          placeholder="Password..." 
          type="password"
          name="password"
          autoComplete="new-password"
          pattern={SCHEMA_CONSTANTS.PASSWORD_REGEX.source}
          svgXml={LockSVG} 
          text={password} 
          setText={setPassword} 
        />
        
        <Button svgXml={UploadSVG} disabled={!valid} onClick={() => submit()}>Submit</Button>
        {error && <small>{error}</small>}
      </div>
    )
  }

  React.useEffect(() => {
    if (!modal.content) {
      setRegisterModalVisible(false)
      setLoginModalVisible(false)
      setLogoutModalVisible(false)
    }
  }, [modal.content])

  React.useEffect(() => {
    if (registerModalVisible) {
      modal.setContent(<Register />)
    } else {
      modal.setContent(null)
    }
  }, [registerModalVisible])

  React.useEffect(() => {
    if (loginModalVisible) {
      modal.setContent(<LogIn />)
    } else {
      modal.setContent(null)
    }
  }, [loginModalVisible])

  React.useEffect(() => {
    if (logoutModalVisible) {
      const yes = () => {
        void auth.logout()

        setLogoutModalVisible(false)
      }

      const no = () => {
        setLogoutModalVisible(false)
      }

      modal.setContent(
        <AreYouSure {...{yes, no}}>
          <h2>Are you sure you want to log out?</h2>
        </AreYouSure>
      )
    } else {
      modal.setContent(null)
    }
  }, [logoutModalVisible])

  return (
    <div id="auth">
      {auth.authenticated ? <>
        <div id="auth-welcome">
          <p>Welcome, {user.displayName || "..."}!</p>
          <Button svgXml={LogOutSvg} onClick={() => setLogoutModalVisible(true)}>Log out</Button>
        </div>
      </> : <>
        <Button svgXml={LogInSvg} onClick={() => setLoginModalVisible(true)}>Log in</Button>
        <Button svgXml={UserPlusSvg}  onClick={() => setRegisterModalVisible(true)}>Register</Button>
      </>}
    </div>
  )
}
