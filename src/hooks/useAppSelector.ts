import { useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../store/store';

// Typed hook untuk selector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;