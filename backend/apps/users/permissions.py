"""Permissions personnalisées par rôle"""
from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Accès réservé aux administrateurs"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsManager(permissions.BasePermission):
    """Accès réservé aux gestionnaires et administrateurs"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'manager']


class IsAdminOrReadOnly(permissions.BasePermission):
    """Lecture pour tous les authentifiés, écriture pour les admins"""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.role == 'admin'


class IsManagerOrReadOnly(permissions.BasePermission):
    """Lecture pour tous, écriture pour gestionnaires+"""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.role in ['admin', 'manager']
