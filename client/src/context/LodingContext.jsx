import { createContext, useContext, useEffect, useState } from "react";
const Lodingctx = createContext(null);

export function LodingProvider({ children }) {
    const [loading, setLoading] = useState(false);

    return(
        <Lodingctx.Provider value={{loading,setLoading}}>
            {children}
        </Lodingctx.Provider>
    )

}
export const useloding=()=>useContext(Lodingctx)