import type { ReactNode } from 'react';
import * as React from 'react';
import ModalStack from './stack';
import type { ModalDescriptorAny, ModalID, ModalMap } from './types';

interface ModalContextType {
    modals: ModalDescriptorAny[];
    openModal: <K extends ModalID>(id: K, props: ModalMap[K]) => void;
    closeModal: () => void;
    closeAllModals: () => void;
}

const ModalContext = React.createContext<ModalContextType | undefined>(
    undefined,
);

export const useModal = () => {
    const ctx = React.useContext(ModalContext);
    if (!ctx) throw new Error('useModal must be used within ModalProvider');
    return ctx;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [modals, setModals] = React.useState<ModalDescriptorAny[]>([]);

    const openModal = <K extends ModalID>(id: K, props: ModalMap[K]) => {
        const descript = {
            id,
            props,
        } as ModalDescriptorAny;

        setModals((modals) => [...modals, descript]);
    };

    const closeModal = () => {
        setModals((modals) => modals.slice(0, -1));
    };

    const closeAllModals = () => {
        setModals([]);
    };

    return (
        <ModalContext.Provider
            value={{ modals, openModal, closeModal, closeAllModals }}
        >
            {children}
            <ModalStack modals={modals} onClose={closeModal} />
        </ModalContext.Provider>
    );
};
