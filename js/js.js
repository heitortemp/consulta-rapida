// JavaScript Document
startList = function() {
	if (document.all&&document.getElementById) {
		navRoot = document.getElementById("nav");
		for (i = 0; i <navRoot.childNodes.length; i++) {
			node = navRoot.childNodes[i];
			if (node.nodeName == "LI") {
				node.onmouseover = function() {
					this.className += " over";
  				}
				node.onmouseout = function() {
					this.className = this.className.replace(" over", "");
				}
   			}
  		}
 	}
}
window.onload=startList;

function load_content(element) {
	$("#topics").html("");
	$.ajax({
		type: "GET",
		dataType: "XML",
		url:"content.xml",
		success: function(xml) {
			$(xml).find("#"+element).each(function() {
				$(this).children("item").each(function() {
					var id_item = $(this).attr("id");
					var name_item = $(this).attr("name");
					$("<div class='row-fluid itens "+id_item+"'></div>").html("<h3 class='hidden-desktop'>"+name_item+"</h3><span class='visible-desktop' id='"+id_item+"'></span>" + $(this).text()).appendTo("#topics");
				});
			});
		}
	});
};
function menu_behavior(element) {
	var target = element.name;
	$("#"+target).slideToggle({duration: 300});
}
$(document).ready(function(e) {
    $.ajax({
		type: "GET",
		dataType: "XML",
		url:"content.xml",
		success: function(xml){
			$(xml).find("artigo").each(function(i, e) {
            	var nome_artigo = $(this).attr("name");
				var id_artigo = $(this).attr("id");
				$("<div class='menu_header'></div>").html("<a name='"+id_artigo+"' href='#' onclick='menu_behavior(this)'>"+nome_artigo+"</a>").appendTo("#menu");
				if (i == 0) {
					$("#menu").append("<div id='"+id_artigo+"' class='group-menu in'></div>");
				} else {
					$("#menu").append("<div id='"+id_artigo+"' class='group-menu out'></div>");
				}
				$("#articles").append("<option value='"+id_artigo+"'>"+nome_artigo+"</option>")
				$("#"+id_artigo).append("<ul></ul>");
				$(this).find("topico").each(function() {
                    var nome_topico = $(this).attr("name");
					var id_topico = $(this).attr("id");	
					var subtopico = $("subtopico", this);
					$("<li id='"+id_topico+"'></li>").html("<a href='#' id='"+id_topico+"' onclick='load_content(this.id)'>"+nome_topico+"</a>").appendTo("#"+id_artigo+" > ul");
					if (subtopico.attr("id")) {
						$("li#"+id_topico).append("<ul></ul>");
					};
					$(this).children("subtopico").each(function() {
						var nome_subtopico = $(this).attr("name");
						var id_subtopico = $(this).attr("id");
						$("<li></li>").html("<a href='#' id='"+id_subtopico+"' onclick='load_content(this.id)'>"+nome_subtopico+"</a>").appendTo("#"+id_artigo+" ul li#"+id_topico+" ul");
					});
                });
            });
		}	
	});
	$("#articles").change(function() {
		var article = this.value;
		$("#schemes").show("fast");
		$("#schemes option").remove();
		if (article != "") {
			$.ajax({
				type: "GET",
				dataType: "XML",
				url:"content.xml",
				success: function(xml) {
					$(xml).find("#"+article).each(function() {
						$("#schemes").append("<option value=''>Selecione um artigo</option>");
                        $(this).find("topico").each(function() {
							var id_topic = $(this).attr("id");
                            var topic_name = $(this).attr("name");
							$("#schemes").append("<option value='"+id_topic+"'>"+topic_name+"</option>")
                        });
                    });
				}
			});
		};
	});
	$("#schemes").change(function() {
		var scheme = this.value;
		if (article != "") {
			$.ajax({
				type: "GET",
				dataType: "XML",
				url:"content.xml",
				success: function(xml) {
					$(xml).find("#"+scheme).each(function() {
						$("#subschemes").hide(100);
						var subtopic = $("subtopico", this);
						if (subtopic.length > 1) {
							$("#subschemes option").remove();
							$("#subschemes").append("<option value=''>Selecione um artigo</option>");
							$("#subschemes").show(100);			
							$(this).children("subtopico").each(function() {
								var id_subtopic = $(this).attr("id");
								var subtopic_name = $(this).attr("name");
								$("#subschemes").append("<option value='"+id_subtopic+"'>"+subtopic_name+"</option>")
							});
						}
                    });
				}
			});
		};		
	});
	$("#filter ul li").click(function(e) {
		var id = $("a", this).attr("id");
		$("."+id).toggle();
    	$("a", this).toggleClass('highlight');
	});
	$("#todos").click(function(e) {
		var itens = $(".itens").css("display");
		if (itens == 'block') {
			$(".itens").css({"display": "none"});
			$(".opcoes").removeClass('highlight');
		} else {
			$(".itens").css({"display": "block"});
			$(".opcoes").addClass('highlight');
		}
	});
});