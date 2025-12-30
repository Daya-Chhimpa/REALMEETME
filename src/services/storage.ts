import AsyncStorage from '@react-native-async-storage/async-storage';

const REGISTRATION_DRAFT_KEY = '@registration_draft';
const AUTH_TOKEN_KEY = '@auth_token';
const USER_DATA_KEY = '@user_data';

// --- Registration Draft ---

export const saveRegistrationDraft = async (data: any) => {
    try {
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem(REGISTRATION_DRAFT_KEY, jsonValue);
    } catch (e) {
        console.error('Failed to save registration draft', e);
    }
};

export const getRegistrationDraft = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(REGISTRATION_DRAFT_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error('Failed to load registration draft', e);
        return null;
    }
};

export const clearRegistrationDraft = async () => {
    try {
        await AsyncStorage.removeItem(REGISTRATION_DRAFT_KEY);
    } catch (e) {
        console.error('Failed to clear registration draft', e);
    }
};

// --- Auth Token ---

export const setToken = async (token: string) => {
    try {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch (e) {
        console.error('Failed to save token', e);
    }
};

export const getToken = async () => {
    try {
        return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    } catch (e) {
        console.error('Failed to get token', e);
        return null;
    }
};

export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (e) {
        console.error('Failed to remove token', e);
    }
};

// --- User Data ---

export const setUser = async (user: any) => {
    try {
        const jsonValue = JSON.stringify(user);
        await AsyncStorage.setItem(USER_DATA_KEY, jsonValue);
    } catch (e) {
        console.error('Failed to save user data', e);
    }
};

export const getUser = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(USER_DATA_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error('Failed to get user data', e);
        return null;
    }
};

export const removeUser = async () => {
    try {
        await AsyncStorage.removeItem(USER_DATA_KEY);
    } catch (e) {
        console.error('Failed to remove user data', e);
    }
};

// --- Match Filters ---

const MATCH_FILTERS_KEY = '@match_filters';

export const saveMatchFilters = async (filters: any) => {
    try {
        const jsonValue = JSON.stringify(filters);
        await AsyncStorage.setItem(MATCH_FILTERS_KEY, jsonValue);
    } catch (e) {
        console.error('Failed to save match filters', e);
    }
};

export const getMatchFilters = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(MATCH_FILTERS_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error('Failed to load match filters', e);
        return null;
    }
};
