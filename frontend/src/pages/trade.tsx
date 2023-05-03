// pages/Properties.js

import React, { useEffect } from 'react';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import PropertyCard from '../components/PropertyCard';
import { usePropertyContext } from '../contexts/PropertyContext';

const Properties = () => {
    const { properties, fetchProperties } = usePropertyContext();

    useEffect(() => {
        fetchProperties();
    }, []);

    return (
        <Box>
            <h1>Properties to Trade</h1>
            <Grid
                templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
                gap={4}
            >
                {properties.map((property, index) => (
                    <GridItem key={index}>
                        <PropertyCard
                            property={property}
                            shareholders={property.shareholders}
                        />
                    </GridItem>
                ))}
            </Grid>
        </Box>
    );
};

export default Properties;
