
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import api from '../../services/api';
import {
    getRegistrationDraft,
    saveRegistrationDraft,
    clearRegistrationDraft,
    setToken,
    setUser,
    getToken,
    getUser,
    removeToken,
    removeUser,
} from '../../services/storage';

// Define types based on screenshots
// Define types
export interface RegistrationData {
    mobile?: string;
    name?: string;
    password?: string;
    gender?: string;
    dob?: string;
    relationshipStatus?: string;
    lookingFor?: string;
    images?: { url: string; type: string; filename: string }[];
    interests?: string[];
    otpVerified?: boolean;
    address?: string;
    // Add other fields as necessary
}

interface AuthState {
    user: any | null;
    token: string | null;
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;
    otpSent: boolean;
    otpVerified: boolean;
    registrationDraft: RegistrationData;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isLoading: false,
    isInitialized: false,
    error: null,
    otpSent: false,
    otpVerified: false,
    registrationDraft: {},
};

// Async Thunks

export const initializeAuth = createAsyncThunk(
    'auth/initialize',
    async (_, { rejectWithValue }) => {
        try {
            const token = await getToken();
            const user = await getUser();
            return { token, user };
        } catch (error) {
            return rejectWithValue('Failed to initialize auth');
        }
    }
);

export const sendOtp = createAsyncThunk(
    'auth/sendOtp',
    async (mobile: string, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/otp/send', { mobile });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to send OTP',
            );
        }
    },
);

export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async (
        { mobile, otp }: { mobile: string; otp: string },
        { rejectWithValue },
    ) => {
        try {
            const response = await api.post('/auth/otp/verify', { mobile, otp });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to verify OTP',
            );
        }
    },
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (
        userData: {
            mobile: string;
            name: string;
            password: string;
            gender: string;
            dob: string;
            images?: { url: string; type: string; filename: string }[];
            interests?: string[];
            address?: string; // City ID
        },
        { rejectWithValue },
    ) => {
        try {
            const response = await api.post('/auth/register', userData);
            // Save to storage
            // API Response: { status: true, data: { token: "...", ...user } }
            const responseData = response.data;
            const userObj = responseData.data || responseData;
            const token = userObj.token;

            if (token) {
                await setToken(token);
                if (userObj) {
                    await setUser(userObj);
                }
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Registration failed',
            );
        }
    },
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async (
        credentials: { mobile: string; otp: string; password: string },
        { rejectWithValue },
    ) => {
        try {
            const response = await api.post('/auth/login', credentials);
            // Save to storage
            // API Response: { status: true, data: { token: "...", ...user } }
            const responseData = response.data;
            const userObj = responseData.data || responseData;
            const token = userObj.token;

            if (token) {
                await setToken(token);
                if (userObj) {
                    await setUser(userObj);
                }
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Login failed',
            );
        }
    },
);

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (mobile: string, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/password/forgot', { mobile });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to send OTP',
            );
        }
    },
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (
        data: { mobile: string; otp: string; password: string },
        { rejectWithValue },
    ) => {
        try {
            const response = await api.post('/auth/password/reset', data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to reset password',
            );
        }
    },
);

export const getProfile = createAsyncThunk(
    'auth/getProfile',
    async (_, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const userid = state.auth.user?._id;
            const token = state.auth.token;
            const config = {
                headers: {
                    userid: userid,
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await api.get('/auth/profile/get', config);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch profile',
            );
        }
    },
);

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (profileData: any, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const userid = state.auth.user?._id;
            const token = state.auth.token;
            const config = {
                headers: {
                    userid: userid,
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await api.put('/auth/profile/update', profileData, config);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update profile',
            );
        }
    },
);

export const changePassword = createAsyncThunk(
    'auth/changePassword',
    async (data: any, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const userid = state.auth.user?._id;
            const token = state.auth.token;
            const config = {
                headers: {
                    userid: userid,
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await api.put('/auth/password/change', data, config);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to change password',
            );
        }
    },
);

export const loadRegistrationDraft = createAsyncThunk(
    'auth/loadRegistrationDraft',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getRegistrationDraft();
            return data || {};
        } catch (error) {
            return rejectWithValue('Failed to load draft');
        }
    },
);

export const saveDraft = createAsyncThunk(
    'auth/saveDraft',
    async (data: RegistrationData, { getState, rejectWithValue }) => {
        try {
            const currentState = (getState() as any).auth.registrationDraft;
            const updatedDraft = { ...currentState, ...data };
            await saveRegistrationDraft(updatedDraft);
            return updatedDraft;
        } catch (error) {
            return rejectWithValue('Failed to save draft');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await removeToken();
            await removeUser();
            await clearRegistrationDraft();
            return;
        } catch (error) {
            return rejectWithValue('Failed to logout');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: state => {
            state.error = null;
        },
        resetRegistration: state => {
            state.registrationDraft = {};
            clearRegistrationDraft(); // Fire and forget
        },
    },
    extraReducers: builder => {
        // Initialize Auth
        builder
            .addCase(initializeAuth.pending, state => {
                state.isLoading = true;
            })
            // ... (rest of cases)
            .addCase(initializeAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isInitialized = true;
                state.token = action.payload.token || null;
                state.user = action.payload.user || null;
            })
            .addCase(initializeAuth.rejected, state => {
                state.isLoading = false;
                state.isInitialized = true;
            });

        // Send OTP
        builder
            .addCase(sendOtp.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(sendOtp.fulfilled, state => {
                state.isLoading = false;
                state.otpSent = true;
            })
            .addCase(sendOtp.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Verify OTP
        builder
            .addCase(verifyOtp.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state) => {
                state.isLoading = false;
                state.otpVerified = true;
                // Update draft in state and storage
                state.registrationDraft.otpVerified = true;
                saveRegistrationDraft(state.registrationDraft);
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Register
        builder
            .addCase(registerUser.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                const data = action.payload.data || action.payload;
                state.user = data;
                state.token = data.token;
                state.registrationDraft = {}; // Clear draft on success
                clearRegistrationDraft();
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Login
        builder
            .addCase(loginUser.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                const data = action.payload.data || action.payload;
                state.user = data;
                state.token = data.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Get Profile
            .addCase(getProfile.pending, state => {
                state.isLoading = true;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.data || action.payload;
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update Profile
            .addCase(updateProfile.pending, state => {
                state.isLoading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                // Only update user if the payload looks like a user object (has _id or mobile)
                // This prevents overwriting the user state with a generic success message
                const payloadData = action.payload.data || action.payload;
                if (payloadData && (payloadData._id || payloadData.mobile)) {
                    state.user = payloadData;
                }
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Change Password
            .addCase(changePassword.pending, state => {
                state.isLoading = true;
            })
            .addCase(changePassword.fulfilled, state => {
                state.isLoading = false;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Drafts
        builder.addCase(loadRegistrationDraft.fulfilled, (state, action) => {
            state.registrationDraft = action.payload;
        });
        builder.addCase(saveDraft.fulfilled, (state, action) => {
            state.registrationDraft = action.payload;
        });

        // Logout
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.user = null;
            state.token = null;
            state.otpSent = false;
            state.otpVerified = false;
            state.error = null;
            state.registrationDraft = {};
            state.isLoading = false;
        });
    },
});

export const { clearError, resetRegistration } = authSlice.actions;
export default authSlice.reducer;
