import AsyncStorage from '@react-native-async-storage/async-storage';

const REGISTRATION_DRAFT_KEY = '@registration_draft';

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
