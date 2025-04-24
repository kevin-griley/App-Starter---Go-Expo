import React from 'react';

import DeleteOrganization from '@/modals/delete-organization';
import PatchOrganization from '@/modals/patch-organization';
import PostQuotes from '@/modals/post-quote';
import type { ModalDescriptorAny, ModalID, ModalMap } from './types';

const MODAL_COMPONENTS: {
    [K in ModalID]: React.ComponentType<ModalMap[K]>;
} = {
    PATCH_ORGANIZATION: PatchOrganization,
    DELETE_ORGANIZATION: DeleteOrganization,
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
