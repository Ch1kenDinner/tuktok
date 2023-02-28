import {ButtonHTMLAttributes,InputHTMLAttributes, DetailedHTMLProps, HTMLAttributes} from 'react'

export interface DP extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}
export interface DPButton extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {}
export interface DPInput extends DetailedHTMLProps<InputHTMLAttributes<HTMLDivElement>, HTMLDivElement> {}