import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';

// Typed hook untuk dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();