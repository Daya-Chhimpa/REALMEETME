import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { RootState } from '../store';
import { saveMatchFilters, getMatchFilters } from '../../services/storage';

export interface MatchFilters {
    minAge: number;
    maxAge: number;
    distance: number;
    gender?: string; // Changed to optional/string, allowing undefined for initial state
    city: string;
    photosOnly: boolean;
    verifiedOnly: boolean;
    onlineNow: boolean;
}

export interface Profile {
    _id: string;
    name: string;
    age: number;
    gender: string;
    dob: string;
    location: {
        address: string;
        coordinates: [number, number];
    } | string;
    address?: string;
    images: { url: string }[];
    about?: string;
    jobTitle?: string;
    company?: string;
    college?: string;
    interests?: string[];
    isVerified?: boolean;
    isOnline?: boolean;
    lookingFor?: string; // Added as optional
}

interface MatchState {
    profiles: Profile[];
    currentProfileIndex: number;
    filters: MatchFilters;
    isLoading: boolean;
    likesList: Profile[];
    likesLoading: boolean;
    error: string | null;
}

const initialState: MatchState = {
    profiles: [],
    currentProfileIndex: 0,
    filters: {
        minAge: 18,
        maxAge: 70,
        distance: 50,
        gender: undefined, // Let it be inferred later if not set
        city: '',
        photosOnly: true,
        verifiedOnly: false,
        onlineNow: false,
    },
    isLoading: false,
    likesList: [],
    likesLoading: false,
    error: null,
};

export const loadFilters = createAsyncThunk(
    'match/loadFilters',
    async (_, { rejectWithValue }) => {
        try {
            const filters = await getMatchFilters();
            return filters;
        } catch (error) {
            return rejectWithValue('Failed to load filters');
        }
    }
);

export const updateFilters = createAsyncThunk(
    'match/updateFilters',
    async (newFilters: Partial<MatchFilters>, { getState, dispatch, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const currentFilters = state.match.filters;
            const updatedFilters = { ...currentFilters, ...newFilters };

            // Dispatch update to store
            dispatch(matchSlice.actions.setFilters(newFilters));

            // Save to storage
            await saveMatchFilters(updatedFilters);

            return updatedFilters;
        } catch (error) {
            return rejectWithValue('Failed to save filters');
        }
    }
);

export const getRandomUsers = createAsyncThunk(
    'match/getRandomUsers',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const { filters } = state.match;
            const { user, token } = state.auth;

            if (!user || !user._id) {
                return rejectWithValue('User not authenticated');
            }

            // Determine gender to look for
            // If filters.gender is set (explicit search), use that. 
            // If NOT set, infer based on user gender (men -> women, women -> men).
            let targetGender = filters.gender;

            if (!targetGender) {
                targetGender = user.gender === 'Male' ? 'women' : 'men';
            }

            // Map 'women'/'men' to API 'Female'/'Male'
            let apiGender = 'Female';
            if (targetGender === 'men') apiGender = 'Male';
            else if (targetGender === 'women') apiGender = 'Female';

            const payload = {
                gender: apiGender,
                minAge: filters.minAge,
                maxAge: filters.maxAge,
                address: filters.city || undefined,
                matchOtherCities: true,
                // photosOnly, verifiedOnly handled by API or client filtering?
                // Assuming API handles basic filtering.
            };

            const config = {
                headers: {
                    userid: user._id,
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await api.post('/users/random', payload, config);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch matches',
            );
        }
    }
);

export const likeUser = createAsyncThunk(
    'match/likeUser',
    async (targetUserId: string, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const { user, token } = state.auth;

            if (!user || !user._id) {
                return rejectWithValue('User not authenticated');
            }

            const config = {
                headers: {
                    userid: user._id,
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await api.post('/user/like', { targetUserId }, config);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to like user');
        }
    }
);

export const getLikesList = createAsyncThunk(
    'match/getLikesList',
    async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const { user, token } = state.auth;

            if (!user || !user._id) {
                return rejectWithValue('User not authenticated');
            }

            const config = {
                headers: {
                    userid: user._id,
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await api.post('/user/likes/list', { page, limit }, config);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch likes list');
        }
    }
);

const matchSlice = createSlice({
    name: 'match',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<Partial<MatchFilters>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            // Reset to default internal state, gender becomes undefined again
            state.filters = initialState.filters;
            saveMatchFilters(initialState.filters); // Fire and forget
        },
        nextProfile: (state) => {
            if (state.currentProfileIndex < state.profiles.length - 1) {
                state.currentProfileIndex += 1;
            }
        },
        resetProfileIndex: (state) => {
            state.currentProfileIndex = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadFilters.fulfilled, (state, action) => {
                if (action.payload) {
                    state.filters = { ...state.filters, ...action.payload };
                }
            })
            .addCase(getRandomUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getRandomUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                const newProfiles = action.payload.data || [];
                state.profiles = newProfiles;
                state.currentProfileIndex = 0;
            })
            .addCase(getRandomUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getLikesList.pending, (state) => {
                state.likesLoading = true;
            })
            .addCase(getLikesList.fulfilled, (state, action) => {
                state.likesLoading = false;
                state.likesList = action.payload.data?.users || [];
            })
            .addCase(getLikesList.rejected, (state, action) => {
                state.likesLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setFilters, resetFilters, nextProfile, resetProfileIndex } = matchSlice.actions;
export default matchSlice.reducer;
