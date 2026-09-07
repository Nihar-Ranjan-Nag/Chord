import {ManagedEventsTable} from '@/components/events/ManagedEventsTable'
export function AdminEventsPage(){return <ManagedEventsTable apiBase="/admin/events" routeBase="/admin/events" eyebrow="EVENT MANAGEMENT" title="All events" description="Create, edit, publish and manage events from organizers and administrators."/>}
