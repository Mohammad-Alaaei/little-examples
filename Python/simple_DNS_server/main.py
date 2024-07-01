import socket
from dnslib import DNSRecord, RR, A, QTYPE
from dnslib.server import DNSServer, DNSHandler, BaseResolver
import re

class ManualResolver(BaseResolver):
    def __init__(self, filename):
        self.domains = {}
        self.load_domains(filename)

    def load_domains(self, filename):
        with open(filename, 'r') as file:
            for line in file:
                parts = line.strip().split()
                domain = parts[0]
                ips = parts[1:]
                self.domains[domain] = ips

    def resolve(self, request, handler):
        qname = request.q.qname
        qname_str = str(qname).rstrip('.')
        for domain, ips in self.domains.items():
            # print(domain)
            if re.match(domain, qname_str):
                reply = request.reply()
                for ip in ips:
                    reply.add_answer(RR(qname, QTYPE.A, rdata=A(ip)))
                return reply
        # If domain not found in manual configuration, resolve using external DNS server
        return self.resolve_external_dns(request, handler)

    def resolve_external_dns(self, request, handler):
        # Implement logic to forward the query to an external DNS resolver
        # For example, using the socket library to send the query to Google's public DNS (8.8.8.8)
        external_dns_server = ('78.157.42.100', 53)   # feel free to change '8.8.8.8' to whatever external server you want.
        query = request.pack()
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.sendto(query, external_dns_server)
        response, _ = sock.recvfrom(1024)
        return DNSRecord.parse(response)

def main():
    filename = "domains.txt"  # File containing domain mappings
    resolver = ManualResolver(filename)

    # Create a DNS server
    dns_server = DNSServer(resolver, port=53, address='0.0.0.0')

    try:
        dns_server.start_thread()
        print("DNS server running on localhost:53")
        input("Press Enter to stop...\n")
    finally:
        dns_server.stop()

if __name__ == "__main__":
    main()
