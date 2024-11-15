import { NavBar } from "./navbar/navbar"

export const Home = () => {
  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center justify-between p-24">
        <h1 className="text-4xl font-bold text-center">
          Welcome!
        </h1>
      </div>
    </>
  )
}

