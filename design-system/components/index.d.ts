import type * as React from 'react';
export interface NavItem { label: string; href: string }
export interface SiteNavProps { name?: string; homeHref?: string; items?: NavItem[]; current?: string }
export declare function SiteNav(props: SiteNavProps): React.ReactElement;
export interface ArticleHeaderProps { title: string; kind?: 'essay' | 'poem' | 'episode'; lead?: string; date?: string; readingTime?: string; series?: string; topics?: Array<string | { label: string; href: string }> }
export declare function ArticleHeader(props: ArticleHeaderProps): React.ReactElement;
export interface PostListItemProps { title: string; href?: string; summary?: string; date?: string; series?: string }
export declare function PostListItem(props: PostListItemProps): React.ReactElement;
export interface LogEntry { date: string; kind: 'pushed' | 'release' | 'project' | 'essay' | 'poem' | 'episode'; title: string; href?: string; detail?: string }
export interface LogProps { entries: LogEntry[]; today?: string; limit?: number; title?: string; filters?: boolean; initialFilter?: 'all' | 'built' | 'essay' | 'poem' | 'episode'; moreHref?: string; moreLabel?: string }
export declare function Log(props: LogProps): React.ReactElement;
export interface Project { name: string; href?: string; summary: string; language?: string; lastPush?: string; since?: string }
export interface ProjectTableProps { projects: Project[]; today?: string; title?: string | false; count?: string; moreHref?: string; moreLabel?: string }
export declare function ProjectTable(props: ProjectTableProps): React.ReactElement;
export interface VerseProps { title?: string; stanzas: string[][]; numberEvery?: number }
export declare function Verse(props: VerseProps): React.ReactElement;
export interface CodeBlockProps { code: string; lang?: string; filename?: string }
export declare function CodeBlock(props: CodeBlockProps): React.ReactElement;
export interface TagProps { children?: React.ReactNode; href?: string; className?: string }
export declare function Tag(props: TagProps): React.ReactElement;
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'quiet' | 'primary' | 'text'; href?: string }
export declare function Button(props: ButtonProps): React.ReactElement;
export interface MarkProps { children?: React.ReactNode }
export declare function Mark(props: MarkProps): React.ReactElement;
declare global { interface Window { Prass: { SiteNav: typeof SiteNav; ArticleHeader: typeof ArticleHeader; PostListItem: typeof PostListItem; Log: typeof Log; ProjectTable: typeof ProjectTable; Verse: typeof Verse; CodeBlock: typeof CodeBlock; Tag: typeof Tag; Button: typeof Button; Mark: typeof Mark } } }
