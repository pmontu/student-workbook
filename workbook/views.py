from django.http import HttpResponse

def redirect(request):
	return HttpResponse("Loading..<script>window.location='/static/index.html';</script>")