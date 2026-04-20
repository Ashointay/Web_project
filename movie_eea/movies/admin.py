from django.contrib import admin
from .models import Movie, Genre, Subscription, Review
admin.site.register([Movie, Genre, Subscription, Review])
