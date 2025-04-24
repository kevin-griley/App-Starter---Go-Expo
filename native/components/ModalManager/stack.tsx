import React from 'react';

import PatchOrganization from '@/screens/accounts/account/patch-organization';
import { PostQuotes } from '@/screens/organization/quotes/post-quote';
import type { ModalDescriptorAny, ModalID, ModalMap } from './types';

const MODAL_COMPONENTS: {
    [K in ModalID]: React.ComponentType<ModalMap[K]>;
} = {
    PATCH_ORGANIZATION: PatchOrganization,
    POST_QUOTES: PostQuotes,
};

interface ModalStackProps {
    modals: ModalDescriptorAny[];
    onClose: () => void;
}

const ModalStack: React.FC<ModalStackProps> = ({ modals, onClose }) => {
    if (modals.length === 0) return null;

    const { id, props } = modals[modals.length - 1] as ModalDescriptorAny;

    const ModalComponent = MODAL_COMPONENTS[id] as React.ComponentType<
        ModalMap[typeof id]
    >;

    return <ModalComponent {...props} closeModal={onClose} />;
};

export default ModalStack;
