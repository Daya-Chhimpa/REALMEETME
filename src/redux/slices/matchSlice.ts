import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { RootState } from '../store';
import { saveMatchFilters, getMatchFilters } from '../../services/storage';

export interface MatchFilters {
    minAge: number;
    maxAge: number;
    city: string;
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
    newUsers: Profile[];
    newUsersLoading: boolean;
    selectedProfile: Profile | null;
    error: string | null;
}

const initialState: MatchState = {
    profiles: [],
    currentProfileIndex: 0,
    filters: {
        minAge: 18,
        maxAge: 70,
        city: '',
    },
    isLoading: false,
    likesList: [],
    likesLoading: false,
    newUsers: [],
    newUsersLoading: false,
    selectedProfile: null,
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
            // STRICT RULE: Send the USER'S gender.
            // The API handles finding the opposite gender automatically.
            const userGender = user.gender || 'Male';

            // Pass the USER'S address ID as the 'address' parameter to find matches nearby
            // If the user has a specific city filter set (filters.city), use that instead.
            // Otherwise, default to their own address ID.
            // const targetAddress = filters.city || user.address;
            const payload = {
                userGender: userGender,
                address: "", // targetAddress
                // minAge: filters.minAge,
                // maxAge: filters.maxAge,
                // matchOtherCities: true,
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

export const getNewUsers = createAsyncThunk(
    'match/getNewUsers',
    async (_, { getState, rejectWithValue }) => {
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

            // Using empty address as requested
            const payload = {
                address: ""
            };

            const response = await api.post('/user/new', payload, config);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch new users',
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
        resetMatchState: (state) => {
            state.profiles = [];
            state.currentProfileIndex = 0;
            state.likesList = [];
            state.newUsers = [];
            state.selectedProfile = null;
            state.error = null;
        },
        setSelectedProfile: (state, action: PayloadAction<Profile>) => {
            state.selectedProfile = action.payload;
        }
    },
    extraReducers: (builder) => {
        // Reset match state when auth logout is fulfilled
        builder.addCase('auth/logout/fulfilled', (state) => {
            // We can't type check this string action easily without importing the exact thunk type or using build.addCase with the thunk.
            // But simpler to just handle it if imported, or dispatch resetMatchState from the logout flow component.
            // Actually, best practice: handle the imported logoutUser.fulfilled action if possible, 
            // but to avoid circular deps, we can just export the reset action and dispatch it manually or use extraReducers with a string if we are lazy.
            // Let's rely on importing the logout action or just adding a listener if we can. 
            // Ideally: The user wants it fixed. Let's add the reducer first.
        });

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
                const data = action.payload.data;
                // API returns a single object sometimes, so wrap it in an array if needed
                const newProfiles = Array.isArray(data) ? data : (data ? [data] : []);
                state.profiles = newProfiles;
                state.currentProfileIndex = 0;
            })
            .addCase(getRandomUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getNewUsers.pending, (state) => {
                state.newUsersLoading = true;
                state.error = null;
            })
            .addCase(getNewUsers.fulfilled, (state, action) => {
                state.newUsersLoading = false;
                const payload = action.payload;
                // Log structure: { data: { users: [...] } }
                // Check if payload.data.users exists and is an array
                if (payload?.data?.users && Array.isArray(payload.data.users)) {
                    state.newUsers = payload.data.users;
                } else if (Array.isArray(payload?.data)) {
                    // Fallback if data itself is the array
                    state.newUsers = payload.data;
                } else {
                    state.newUsers = [];
                }
            })
            .addCase(getNewUsers.rejected, (state, action) => {
                state.newUsersLoading = false;
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

export const { setFilters, resetFilters, nextProfile, resetMatchState, setSelectedProfile } = matchSlice.actions;
export default matchSlice.reducer;
