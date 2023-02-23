

import { useEffect } from "react"
import useSWR from "swr"

const adminAddresses = {
  "0xa075585816515fa3c6145fdd41bb53b18628df720548c9dd22709df630cacdc6": true,
  "0xfd36511c8035a501abab2a9414fc41361ac1e1212193c930db48a118289a2b2f": true,
  "0xc2ebcf84744256f9e4d5e68d5908eb756986696ba0702b91314872939bb19f05": true,
  "42bc1590a16bbfcf299a916d1569f90ea4e7065d1211979f4126d8d27d74332f":true
}

export const handler = (web3, provider) => () => {

  const { data, mutate, ...rest } = useSWR(() =>
    web3 ? "web3/accounts" : null,
    async () => {
      const accounts = await web3.eth.getAccounts()
      const account = accounts[0]

      if (!account) {
        throw new Error("Cannot retreive an account. Please refresh the browser.")
      }

      return account
    }
  )

  useEffect(() => {
    const mutator = accounts => mutate(accounts[0] ?? null)
    provider?.on("accountsChanged", mutator)

    return () => {
      provider?.removeListener("accountsChanged", mutator)
    }
  }, [provider])

  return {
    data,
    isAdmin: (
      data &&
      adminAddresses[web3.utils.keccak256(data)]) ?? false,
    mutate,
    ...rest
  }
}
