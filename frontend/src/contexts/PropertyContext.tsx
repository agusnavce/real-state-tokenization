import { createContext, useContext, useState } from 'react';
import { getUserProperties, getUserRequestedProperties } from '../lib/property';
import { UserProperty, UserRequestedProperty } from '../types';

interface PropertyContextInterface {
    properties: UserProperty[];
    addProperty: (property: UserProperty) => void;
    fetchProperties: () => void;
    userRequestedProperties: UserRequestedProperty[];
    addUserRequestedProperty: (property: UserRequestedProperty) => void;
    fetchUserRequestedProperties: () => void;
}

const PropertyContext = createContext<PropertyContextInterface | null>(null);

export const usePropertyContext = (): PropertyContextInterface => {
    const context = useContext(PropertyContext);
    if (!context) {
        throw new Error('usePropertyContext must be used within a PropertyProvider');
    }
    return context;
};

export const PropertyProvider = ({ children }): JSX.Element => {
    const [properties, setProperties] = useState<UserProperty[]>([]);
    const [userRequestedProperties, setUserRequestedProperties] = useState<UserRequestedProperty[]>([]);

    const addProperty = (property: UserProperty): void => {
        setProperties((prevProperties) => [...prevProperties, property]);
    };

    const addUserRequestedProperty = (userRequestedProperty: UserRequestedProperty): void => {
        setUserRequestedProperties((prevProperties) => [...prevProperties, userRequestedProperty]);
    }

    const fetchProperties = async (): Promise<void> => {
        try {
            const fetchedProperties = await getUserProperties();
            if (fetchedProperties !== undefined) {
                setProperties(fetchedProperties);
            }
        } catch (error) {
            console.error('Error fetching properties:', error);
        }
    };

    const fetchUserRequestedProperties = async (): Promise<void> => {
        try {
            const fetchedProperties = await getUserRequestedProperties();
            if (fetchedProperties !== undefined) {
                setUserRequestedProperties(fetchedProperties);
            }
        } catch (error) {
            console.error('Error fetching properties:', error);
        }
    };

    const value: PropertyContextInterface = {
        properties,
        addProperty,
        fetchProperties,
        userRequestedProperties,
        addUserRequestedProperty,
        fetchUserRequestedProperties
    };

    return <PropertyContext.Provider value={value}>{children}</PropertyContext.Provider>;
};
