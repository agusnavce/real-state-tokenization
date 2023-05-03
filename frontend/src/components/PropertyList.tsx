import React from "react";
import PropertyCard from './PropertyCard';
import { Grid, GridItem } from '@chakra-ui/react';

function PropertyList ({ properties }) {
    return (
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
    );
}

export default PropertyList;
