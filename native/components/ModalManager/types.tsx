import type { PatchOrganizationProps } from '@/screens/accounts/account/edit-workspace';

export interface ModalMap {
    PATCH_ORGANIZATION: PatchOrganizationProps;
}

export type ModalID = keyof ModalMap;

export type ModalProps = ModalMap[ModalID];

export type ModalDescriptorAny = {
    [K in ModalID]: { id: K; props: ModalMap[K] };
}[ModalID];
