from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Notification
from .serializers import NotificationSerializer


class NotificationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        notifs = Notification.objects.filter(user=request.user)
        unread_count = notifs.filter(is_read=False).count()
        return Response({
            'count': notifs.count(),
            'unread_count': unread_count,
            'notifications': NotificationSerializer(notifs[:50], many=True).data,
        })

    def patch(self, request):
        """Marquer toutes comme lues"""
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'message': 'Toutes les notifications marquées comme lues.'})


class NotificationReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        """Marquer une notification comme lue"""
        try:
            n = Notification.objects.get(pk=pk, user=request.user)
            n.is_read = True
            n.save()
            return Response({'message': 'Notification lue.'})
        except Notification.DoesNotExist:
            return Response({'error': 'Introuvable.'}, status=404)

    def delete(self, request, pk):
        """Supprimer une notification"""
        try:
            Notification.objects.filter(pk=pk, user=request.user).delete()
            return Response({'message': 'Supprimée.'})
        except Exception:
            return Response({'error': 'Erreur.'}, status=400)
