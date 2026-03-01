/* src/services/ProjectAccessService.js */
import { supabase } from './supabase';

export const checkProjectAccess = async (projectId, userId) => {
    if (!userId) return { hasAccess: false, status: 'none' };

    // 1. Check if user is the project owner
    const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('owner_id')
        .eq('id', projectId)
        .single();

    if (projectError) return { hasAccess: false, status: 'error' };
    if (project.owner_id === userId) return { hasAccess: true, status: 'owner' };

    // 2. Check if user has an accepted access request
    const { data: request, error: requestError } = await supabase
        .from('project_access_requests')
        .select('status')
        .eq('project_id', projectId)
        .eq('requester_id', userId)
        .single();

    if (requestError) {
        if (requestError.code === 'PGRST116') { // No rows found
            return { hasAccess: false, status: 'none' };
        }
        return { hasAccess: false, status: 'error' };
    }

    return {
        hasAccess: request.status === 'accepted',
        status: request.status
    };
};

export const requestProjectAccess = async (projectId, userId) => {
    // We use upsert to handle cases where a user might re-request after a rejection
    const { error } = await supabase
        .from('project_access_requests')
        .upsert(
            { project_id: projectId, requester_id: userId, status: 'pending' },
            { onConflict: 'project_id, requester_id' }
        );

    return { success: !error, error };
};

export const updateAccessRequest = async (requestId, status) => {
    const { error } = await supabase
        .from('project_access_requests')
        .update({ status })
        .eq('id', requestId);

    return { success: !error, error };
};

export const fetchAccessRequests = async (projectId) => {
    const { data, error } = await supabase
        .from('project_access_requests')
        .select('*, profiles!requester_id(username, avatar_url, role)')
        .eq('project_id', projectId);

    return { data, error };
};
