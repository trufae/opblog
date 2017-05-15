# 2017-05-15

SETEND
------

This instruction exists on ARMv6 and it is used to specify the endianness of the data read instructions like `LDR`.

http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.dui0489f/Cjacabbf.html

Encoding
--------

	setend le -> 000201f1
	setend be -> 000001f1
