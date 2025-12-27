import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { getRegistrationDraft, saveRegistrationDraft, clearRegistrationDraft } from '../../services/storage';

// Define types based on screenshots
// Define types
export interface RegistrationData {
    mobile?: string;
    name?: string;
    password?: string;
    gender?: string;
    dob?: string;
    images?: string[];
    interests?: string[];
    otpVerified?: boolean;
    // Add other fields as necessary
}

interface AuthState {
    user: any | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    otpSent: boolean;
    otpVerified: boolean;
    registrationDraft: RegistrationData;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isLoading: false,
    error: null,
    otpSent: false,
    otpVerified: false,
    registrationDraft: {},
};

// Async Thunks

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
            images?: string[];
        },
        { rejectWithValue },
    ) => {
        try {
            const response = await api.post('/auth/register', userData);
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
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Login failed',
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

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: state => {
            state.user = null;
            state.token = null;
            state.otpSent = false;
            state.otpVerified = false;
            state.error = null;
            // We might consciously decide NOT to clear the draft on logout, or WE DO.
            // Usually logging out implies clearing sensitive user data.
            state.registrationDraft = {};
        },
        clearError: state => {
            state.error = null;
        },
        resetRegistration: state => {
            state.registrationDraft = {};
            clearRegistrationDraft(); // Fire and forget
        },
    },
    extraReducers: builder => {
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
            .addCase(verifyOtp.fulfilled, state => {
                state.isLoading = false;
                state.otpVerified = true;
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
                state.user = action.payload.user;
                state.token = action.payload.token;
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
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
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
    },
});

export const { logout, clearError, resetRegistration } = authSlice.actions;
export default authSlice.reducer;
