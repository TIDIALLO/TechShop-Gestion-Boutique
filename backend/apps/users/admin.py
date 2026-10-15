from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, ActivityLog


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'first_name', 'last_name', 'role', 'is_active', 'created_at']
    list_filter = ['role', 'is_active', 'is_staff']
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['-created_at']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Infos Supplémentaires', {'fields': ('role', 'phone', 'avatar', 'last_login_ip')}),
        ('Géolocalisation', {'fields': ('latitude', 'longitude', 'location_address')}),
    )


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'resource', 'ip_address', 'created_at']
    list_filter = ['action', 'resource']
    search_fields = ['user__email', 'description']
    readonly_fields = ['created_at']
