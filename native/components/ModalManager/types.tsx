import type { DeleteOrganizationProps } from '@/modals/delete-organization';
import type { PatchOrganizationProps } from '@/modals/patch-organization';
import type { PostQuotesProps } from '@/modals/post-quote';

export interface ModalMap {
    PATCH_ORGANIZATION: PatchOrganizationProps;
    DELETE_ORGANIZATION: DeleteOrganizationProps;
    POST_QUOTES: PostQuotesProps;
}

export type ModalID = keyof ModalMap;

export type ModalProps = ModalMap[ModalID];

export type ModalDescriptorAny = {
    [K in ModalID]: { id: K; props: ModalMap[K] };
}[ModalID];
