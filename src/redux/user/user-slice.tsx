import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { TAuthResponse } from "@/schemas/auth.schema";
import { ERole } from "@/types/enums/role.enum";

interface UserState {
    user: TAuthResponse | null;
    isAuthenticated: boolean;
    role: ERole | null;
    accessToken: string | null;
    isInitialized: boolean;
}

const initialState: UserState = {
    user: null,
    isAuthenticated: false,
    role: null,
    accessToken: null,
    isInitialized: false,
};

const isTokenExpired = (token: string): boolean => {
    try {
        const decodedToken = jwtDecode(token) as any;
        if (!decodedToken.exp) return true;

        const currentTime = Date.now() / 1000;
        const bufferTime = 30;

        return decodedToken.exp < currentTime + bufferTime;
    } catch (error) {
        return true;
    }
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<TAuthResponse | null>) {
            const userData = action.payload;

            if (!userData || !userData.accessToken) {
                state.user = null;
                state.isAuthenticated = false;
                state.role = null;
                state.accessToken = null;
                localStorage.removeItem("userInfo");
                return;
            }

            if (isTokenExpired(userData.accessToken)) {
                state.user = null;
                state.isAuthenticated = false;
                state.role = null;
                state.accessToken = null;
                localStorage.removeItem("userInfo");
                return;
            }

            try {
                const decodedToken = jwtDecode(userData.accessToken) as any;

                state.user = userData;
                state.isAuthenticated = true;
                state.role = decodedToken.role;
                state.accessToken = userData.accessToken;
                state.isInitialized = true;

                // LƯU VÀO LOCALSTORAGE (bao gồm cả accessToken)
                const userInfoToStore = {
                    username: userData.username,
                    role: decodedToken.role,
                    accessToken: userData.accessToken,
                };

                localStorage.setItem("userInfo", JSON.stringify(userInfoToStore));
            } catch (error) {
                state.user = null;
                state.isAuthenticated = false;
                state.role = null;
                state.accessToken = null;
                localStorage.removeItem("userInfo");
            }
        },

        updateAccessToken(state, action: PayloadAction<string>) {
            const newToken = action.payload;

            if (state.user) {
                state.user.accessToken = newToken;
                state.accessToken = newToken;
                state.isAuthenticated = true;

                // CẬP NHẬT LOCALSTORAGE
                const userInfoStr = localStorage.getItem("userInfo");
                if (userInfoStr) {
                    try {
                        const userInfo = JSON.parse(userInfoStr);
                        userInfo.accessToken = newToken;
                        localStorage.setItem("userInfo", JSON.stringify(userInfo));
                    } catch (error) {
                        console.error("Error updating localStorage:", error);
                    }
                }
            }
        },

        setInitialized(state, action: PayloadAction<boolean>) {
            state.isInitialized = action.payload;
        },

        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.role = null;
            state.accessToken = null;
            state.isInitialized = true;
            localStorage.removeItem("userInfo");
        },
    },
});

export const { setUser, updateAccessToken, setInitialized, logout } = userSlice.actions;
export default userSlice.reducer;