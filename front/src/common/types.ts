import {ButtonHTMLAttributes, DetailedHTMLProps, HTMLAttributes} from 'react'

export interface DP extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}
export interface DPButton extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {}