from rest_framework import permissions

class IsAuthenticatedOrPOSTOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'GET' or request.method == 'DELETE':
            return request.user.is_authenticated
        return request.method == 'POST'

