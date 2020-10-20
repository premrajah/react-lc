# New APIs for Searching Resources

## [A]. Getting Resources belonging to the User’s Organisation

{{base_url}}/api/1/resource


## [B]. Same as [A] with pagination indicating the start offset and the size of the page.

{{base_url}}/api/1/resource?f=1&s=2


Note: Parameters <f> for start offset and <s> for size.


## [C]. Getting Resource counts belonging to the user’s Organisation grouped by Stage.

{{base_url}}/api/1/resource?m=s


Note: Parameters <m> with value {s}


## [D]. Getting Resource counts belonging to the user’s Organisation grouped by Stage.

{{base_url}}/api/1/resource?m=c


Note: Parameters <m> with value {c}


## [E]. Get every Resource on the platform including those from other Organisations

{{base_url}}/api/1/resource?m=a


Note: Parameters <m> with value {a}


## [F]. Same as [E] with pagination indicating the start offset and the size of the page.

{{base_url}}/api/1/resource?m=a&f=0&s=2


Note: Parameters <m> with value {a}. Also, <f> for start offset and <s> for size.



## [G]. Getting every Resources with arbitrary filters.

{{base_url}}/api/1/resource?m=f&t=category.keyword:Plastics,type.keyword=PP


Note: Parameters <m> with value {f} and <t> with value {category.keyword:Plastics,type.keyword=PP}

In this (e.g.) 


category.keyword:Plastics => is the <field = category.keyword> : (colon) the value {Plastics}
	type.keyword=PP => is the <field = type.keyword> : (colon) the value {PP}
	, (comma) separated field-value pairs.



## [H]. Same as [G] with pagination indicating the start offset and the size of the page.

{{base_url}}/api/1/resource?m=f&f=0&s=2&t=category.keyword:Plastics


Note: Parameters <m> with value {f} and <t> with value {category.keyword:Plastics}. Also, <f> for start offset and <s> for size.


# New APIs for Getting Searches


## [A]. Getting Searches belonging to the User’s Organisation

{{base_url}}/api/1/search



## [B]. Same as [A] with pagination indicating the start offset and the size of the page.

{{base_url}}/api/1/search?f=1&s=2


Note: Parameters <f> for start offset and <s> for size.



## [C]. Getting Search counts belonging to the user’s Organisation grouped by Stage.

{{base_url}}/api/1/search?m=s


Note: Parameters <m> with value {s}



## [D]. Getting Search counts belonging to the user’s Organisation grouped by Stage.

{{base_url}}/api/1/search?m=c



Note: Parameters <m> with value {c}