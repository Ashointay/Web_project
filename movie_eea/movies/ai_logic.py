from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .models import Movie

def find_movie_by_description(user_query):
    movies = list(Movie.objects.all())
    if not movies: return None
    
    descriptions = [m.description for m in movies]
    descriptions.append(user_query)
    
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(descriptions)
    
    # Сравниваем последний вектор (запрос) со всеми остальными
    cosine_sim = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])
    
    most_similar_idx = cosine_sim.argsort()[0][-1]
    confidence = cosine_sim[0][most_similar_idx]
    
    if confidence > 0.1: # Порог схожести
        return movies[int(most_similar_idx)]
    return None