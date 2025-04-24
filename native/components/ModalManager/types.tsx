import type { PatchOrganizationProps } from '@/screens/accounts/account/patch-organization';
import type { PostQuotesProps } from '@/screens/organization/quotes/post-quote';

export interface ModalMap {
    PATCH_ORGANIZATION: PatchOrganizationProps;
    POST_QUOTES: PostQuotesProps;
}

export type ModalID = keyof ModalMap;

export type ModalProps = ModalMap[ModalID];

export type ModalDescriptorAny = {
    [K in ModalID]: { id: K; props: ModalMap[K] };
}[ModalID];
