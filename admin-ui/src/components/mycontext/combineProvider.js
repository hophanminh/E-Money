import React from 'react';
import { MyProvider } from './MyContext';
import { PopupProvider } from './PopupContext';
import { CategoryProvider } from './CategoryContext';

const CombinedProvider = ({ children }) => (
    <MyProvider>
        <PopupProvider>
            <CategoryProvider>
                {children}
            </CategoryProvider>
        </PopupProvider>
    </MyProvider>
);

export default CombinedProvider;
