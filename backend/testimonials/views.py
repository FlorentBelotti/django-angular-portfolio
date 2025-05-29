from rest_framework import viewsets, mixins, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Testimonial
from .serializers import TestimonialSerializer, TestimonialCreateSerializer

class TestimonialViewSet(mixins.CreateModelMixin,
                         mixins.ListModelMixin,
                         mixins.RetrieveModelMixin,
                         viewsets.GenericViewSet):

    queryset = Testimonial.objects.filter(status='approved').order_by('-created_at')
    serializer_class = TestimonialSerializer
    
    def get_serializer_class(self):
        if self.action == 'create':
            return TestimonialCreateSerializer
        return TestimonialSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        testimonial = serializer.save(status='pending')
        
        return Response({
            'message': 'Merci pour votre témoignage ! Il sera visible après modération.',
            'id': testimonial.id
        })